import { CalculationRequest } from '../dtos/CalculationRequest';
import { CalculationResponse } from '../dtos/CalculationResponse';
import { ParserService } from './ParserService';
import { InputValidator } from '../../domain/validators/InputValidator';
import { BisectionUseCase } from '../../domain/use-cases/root-finding/BisectionUseCase';
import { FalsePositionUseCase } from '../../domain/use-cases/root-finding/FalsePositionUseCase';
import { FixedPointUseCase } from '../../domain/use-cases/root-finding/FixedPointUseCase';
import { NewtonRaphsonUseCase } from '../../domain/use-cases/root-finding/NewtonRaphsonUseCase';
import { TrapezoidUseCase } from '../../domain/use-cases/integration/TrapezoidUseCase';
import { Simpson13UseCase } from '../../domain/use-cases/integration/Simpson13UseCase';
import { Simpson38UseCase } from '../../domain/use-cases/integration/Simpson38UseCase';
import { LinearInterpolationUseCase } from '../../domain/use-cases/interpolation/LinearInterpolationUseCase';
import { LagrangeUseCase } from '../../domain/use-cases/interpolation/LagrangeUseCase';
import { NewtonDividedDifferencesUseCase } from '../../domain/use-cases/interpolation/NewtonDividedDifferencesUseCase';

/**
 * Servicio orquestador de cálculos numéricos.
 * Coordina validación, parsing, ejecución y respuesta.
 */
export class CalculationService {
  private parserService = new ParserService();
  private validator = new InputValidator();

  async execute(request: CalculationRequest): Promise<CalculationResponse> {
    try {
      const tolerance = request.parameters.tolerance ?? 0.000001;
      const maxIterations = request.parameters.maxIterations ?? 100;

      // Validaciones comunes
      const tolValidation = this.validator.validateTolerance(tolerance);
      if (!tolValidation.valid) {
        return this.errorResponse('INVALID_TOLERANCE', tolValidation.error!);
      }

      switch (request.methodId) {
        case 'bisection':
          return this.executeBisection(request, tolerance, maxIterations);
        case 'false-position':
          return this.executeFalsePosition(request, tolerance, maxIterations);
        case 'fixed-point':
          return this.executeFixedPoint(request, tolerance, maxIterations);
        case 'newton-raphson':
          return this.executeNewtonRaphson(request, tolerance, maxIterations);
        case 'trapezoid':
          return this.executeTrapezoid(request);
        case 'simpson-13':
          return this.executeSimpson13(request);
        case 'simpson-38':
          return this.executeSimpson38(request);
        case 'linear-interpolation':
          return this.executeLinearInterpolation(request);
        case 'lagrange':
          return this.executeLagrange(request);
        case 'newton-dd':
          return this.executeNewtonDD(request);
        default:
          return this.errorResponse('UNKNOWN_METHOD', `Método "${request.methodId}" no reconocido.`);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error inesperado';
      return this.errorResponse('EXECUTION_ERROR', msg);
    }
  }

  private executeBisection(req: CalculationRequest, tolerance: number, maxIterations: number): CalculationResponse {
    if (!req.functionString) return this.errorResponse('MISSING_FUNCTION', 'Debe ingresar f(x).');
    const parsed = this.parserService.parseFunction(req.functionString);
    if (!parsed.success || !parsed.fn) return this.errorResponse('PARSE_ERROR', parsed.error || 'Error parseando f(x).');

    const a = req.parameters.a;
    const b = req.parameters.b;
    if (a === undefined || b === undefined) return this.errorResponse('MISSING_PARAMS', 'Debe ingresar a y b.');

    const intervalCheck = this.validator.validateInterval(a, b);
    if (!intervalCheck.valid) return this.errorResponse('INVALID_INTERVAL', intervalCheck.error!);

    const iterCheck = this.validator.validateIterations(maxIterations);
    if (!iterCheck.valid) return this.errorResponse('INVALID_ITERATIONS', iterCheck.error!);

    const useCase = new BisectionUseCase();
    const result = useCase.execute({ f: parsed.fn, a, b, tolerance, maxIterations });

    return this.mapResult(result);
  }

  private executeFalsePosition(req: CalculationRequest, tolerance: number, maxIterations: number): CalculationResponse {
    if (!req.functionString) return this.errorResponse('MISSING_FUNCTION', 'Debe ingresar f(x).');
    const parsed = this.parserService.parseFunction(req.functionString);
    if (!parsed.success || !parsed.fn) return this.errorResponse('PARSE_ERROR', parsed.error || 'Error parseando f(x).');

    const a = req.parameters.a;
    const b = req.parameters.b;
    if (a === undefined || b === undefined) return this.errorResponse('MISSING_PARAMS', 'Debe ingresar a y b.');

    const intervalCheck = this.validator.validateInterval(a, b);
    if (!intervalCheck.valid) return this.errorResponse('INVALID_INTERVAL', intervalCheck.error!);

    const useCase = new FalsePositionUseCase();
    const result = useCase.execute({ f: parsed.fn, a, b, tolerance, maxIterations });
    return this.mapResult(result);
  }

  private executeFixedPoint(req: CalculationRequest, tolerance: number, maxIterations: number): CalculationResponse {
    if (!req.gFunctionString) return this.errorResponse('MISSING_FUNCTION', 'Debe ingresar g(x).');
    const parsed = this.parserService.parseFunction(req.gFunctionString);
    if (!parsed.success || !parsed.fn) return this.errorResponse('PARSE_ERROR', parsed.error || 'Error parseando g(x).');

    const x0 = req.parameters.x0;
    if (x0 === undefined) return this.errorResponse('MISSING_PARAMS', 'Debe ingresar x₀.');

    const useCase = new FixedPointUseCase();
    const result = useCase.execute({ g: parsed.fn, x0, tolerance, maxIterations });
    return this.mapResult(result);
  }

  private executeNewtonRaphson(req: CalculationRequest, tolerance: number, maxIterations: number): CalculationResponse {
    if (!req.functionString) return this.errorResponse('MISSING_FUNCTION', 'Debe ingresar f(x).');
    const parsed = this.parserService.parseFunction(req.functionString);
    if (!parsed.success || !parsed.fn) return this.errorResponse('PARSE_ERROR', parsed.error || 'Error parseando f(x).');

    const x0 = req.parameters.x0;
    if (x0 === undefined) return this.errorResponse('MISSING_PARAMS', 'Debe ingresar x₀.');

    // Derivada: usar explícita o calcular automáticamente
    let fPrime: (x: number) => number;
    if (req.derivativeString) {
      const derivParsed = this.parserService.parseFunction(req.derivativeString);
      if (!derivParsed.success || !derivParsed.fn) {
        return this.errorResponse('PARSE_ERROR', derivParsed.error || 'Error parseando f\'(x).');
      }
      fPrime = derivParsed.fn;
    } else {
      const derivResult = this.parserService.parseDerivative(req.functionString);
      if (!derivResult.success || !derivResult.derivativeFn) {
        return this.errorResponse('DERIVATIVE_ERROR', 'No se pudo calcular la derivada automáticamente.');
      }
      fPrime = derivResult.derivativeFn;
    }

    const useCase = new NewtonRaphsonUseCase();
    const result = useCase.execute({ f: parsed.fn, fPrime, x0, tolerance, maxIterations });
    return this.mapResult(result);
  }

  private executeTrapezoid(req: CalculationRequest): CalculationResponse {
    if (!req.functionString) return this.errorResponse('MISSING_FUNCTION', 'Debe ingresar f(x).');
    const parsed = this.parserService.parseFunction(req.functionString);
    if (!parsed.success || !parsed.fn) return this.errorResponse('PARSE_ERROR', parsed.error || 'Error parseando.');

    const { a, b, n } = req.parameters;
    if (a === undefined || b === undefined || n === undefined) {
      return this.errorResponse('MISSING_PARAMS', 'Debe ingresar a, b y n.');
    }

    const useCase = new TrapezoidUseCase();
    const result = useCase.execute({ f: parsed.fn, a, b, n });
    return this.mapResult(result);
  }

  private executeSimpson13(req: CalculationRequest): CalculationResponse {
    if (!req.functionString) return this.errorResponse('MISSING_FUNCTION', 'Debe ingresar f(x).');
    const parsed = this.parserService.parseFunction(req.functionString);
    if (!parsed.success || !parsed.fn) return this.errorResponse('PARSE_ERROR', parsed.error || 'Error parseando.');

    const { a, b, n } = req.parameters;
    if (a === undefined || b === undefined || n === undefined) {
      return this.errorResponse('MISSING_PARAMS', 'Debe ingresar a, b y n.');
    }

    const useCase = new Simpson13UseCase();
    const result = useCase.execute({ f: parsed.fn, a, b, n });
    return this.mapResult(result);
  }

  private executeSimpson38(req: CalculationRequest): CalculationResponse {
    if (!req.functionString) return this.errorResponse('MISSING_FUNCTION', 'Debe ingresar f(x).');
    const parsed = this.parserService.parseFunction(req.functionString);
    if (!parsed.success || !parsed.fn) return this.errorResponse('PARSE_ERROR', parsed.error || 'Error parseando.');

    const { a, b, n } = req.parameters;
    if (a === undefined || b === undefined || n === undefined) {
      return this.errorResponse('MISSING_PARAMS', 'Debe ingresar a, b y n.');
    }

    const useCase = new Simpson38UseCase();
    const result = useCase.execute({ f: parsed.fn, a, b, n });
    return this.mapResult(result);
  }

  private executeLinearInterpolation(req: CalculationRequest): CalculationResponse {
    if (!req.points || req.points.length < 2) {
      return this.errorResponse('MISSING_POINTS', 'Debe ingresar al menos 2 puntos.');
    }

    const useCase = new LinearInterpolationUseCase();
    const result = useCase.execute({
      points: req.points,
      evaluateAt: req.parameters.evaluateAt || [],
    });
    return this.mapResult(result);
  }

  private executeLagrange(req: CalculationRequest): CalculationResponse {
    if (!req.points || req.points.length < 2) {
      return this.errorResponse('MISSING_POINTS', 'Debe ingresar al menos 2 puntos.');
    }

    const pointsCheck = this.validator.validateMaxPoints(req.points.length);
    if (!pointsCheck.valid) return this.errorResponse('TOO_MANY_POINTS', pointsCheck.error!);

    const uniqueCheck = this.validator.validateUniqueXPoints(req.points);
    if (!uniqueCheck.valid) return this.errorResponse('DUPLICATE_X', uniqueCheck.error!);

    const useCase = new LagrangeUseCase();
    const result = useCase.execute({
      points: req.points,
      evaluateAt: req.parameters.evaluateAt || [],
    });
    return this.mapResult(result);
  }

  private executeNewtonDD(req: CalculationRequest): CalculationResponse {
    if (!req.points || req.points.length < 2) {
      return this.errorResponse('MISSING_POINTS', 'Debe ingresar al menos 2 puntos.');
    }

    const useCase = new NewtonDividedDifferencesUseCase();
    const result = useCase.execute({
      points: req.points,
      evaluateAt: req.parameters.evaluateAt || [],
    });
    return this.mapResult(result);
  }

  private mapResult(result: import('../../domain/entities/CalculationResult').CalculationResult): CalculationResponse {
    if (!result.success) {
      return {
        success: false,
        error: {
          code: 'CALCULATION_FAILED',
          message: result.error || 'El cálculo no convergió.',
          suggestion: result.warning,
        }
      };
    }

    return {
      success: true,
      data: {
        result: result.result,
        iterations: result.iterations,
        steps: result.steps,
        executionTime: result.executionTime,
        warning: result.warning,
        interpolantFn: result.interpolantFn,
      }
    };
  }

  private errorResponse(code: string, message: string, suggestion?: string): CalculationResponse {
    return {
      success: false,
      error: { code, message, suggestion }
    };
  }
}

// Singleton instance
export const calculationService = new CalculationService();

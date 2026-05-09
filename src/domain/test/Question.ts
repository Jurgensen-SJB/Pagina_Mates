export interface Question {
  id: string;
  topic: string;
  method: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanationBase: string;
}

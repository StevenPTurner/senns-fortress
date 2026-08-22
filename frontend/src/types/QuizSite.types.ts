import type QuizStat from "./QuizStat.types";

export default interface QuizSite {
  name: string,
  link: string,
  image: string,
  imageAlt: string,
  lowQuality: boolean,
  quizStat: QuizStat,
}
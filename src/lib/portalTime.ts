export function isScheduledOnOrAfter(scheduledAt: string, nowMs: number): boolean {
  return new Date(scheduledAt).getTime() >= nowMs
}

export function isDueOnOrAfter(dueDate: string, nowMs: number): boolean {
  return new Date(dueDate).getTime() >= nowMs
}

export function countUpcomingQuizzes<
  T extends { scheduled_at: string },
>(quizzes: T[], nowMs: number): number {
  return quizzes.filter((quiz) => isScheduledOnOrAfter(quiz.scheduled_at, nowMs)).length
}

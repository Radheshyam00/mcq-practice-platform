"use client";
import { Button } from "@/components/common/Button";
export function SubmitQuiz({ onSubmit }: { onSubmit: () => void }) { return <Button variant="danger" onClick={onSubmit}>Submit Quiz</Button>; }

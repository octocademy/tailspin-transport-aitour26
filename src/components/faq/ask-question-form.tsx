"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askQuestion } from "@/app/actions/ask-question";
import { Loader2, Send } from "lucide-react";

/**
 * AskQuestionForm provides an inline form for users to ask FAQ questions
 * that are answered in real-time by an Azure Foundry agent.
 */
export function AskQuestionForm() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission to ask the question.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const answer = await askQuestion(question);
      setResponse(answer);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset the form to ask another question.
   */
  const handleReset = () => {
    setQuestion("");
    setResponse(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Question input form */}
      <div className="rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="What would you like to know?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Response display */}
      {response && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary/20 border border-secondary/30">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Your Question:
            </p>
            <p className="text-foreground">{question}</p>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Answer:
            </p>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {response}
            </p>
          </div>

          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            Ask Another Question
          </Button>
        </div>
      )}
    </div>
  );
}

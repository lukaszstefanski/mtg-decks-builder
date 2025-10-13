import React, { useState } from "react";
import { Button } from "../ui/button";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../../lib/schemas/auth.schemas";

export function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ForgotPasswordFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    try {
      // Client-side validation
      const validatedData = forgotPasswordSchema.parse(formData);
      
      // API call to forgot-password endpoint
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: validatedData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (result.error === "VALIDATION_ERROR" && result.errors) {
          // Handle validation errors from server
          const fieldErrors: Partial<ForgotPasswordFormData> = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field as keyof ForgotPasswordFormData] = messages[0];
            }
          });
          setErrors(fieldErrors);
        } else {
          // Handle other API errors
          setMessage({ type: "error", text: result.message || "Wystąpił błąd podczas wysyłania linku resetującego" });
        }
        return;
      }

      // Successful request
      setMessage({ 
        type: "success", 
        text: result.message || "Link do resetowania hasła został wysłany na podany adres email." 
      });
      setIsSubmitted(true);
      
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        // Handle client-side validation errors
        const zodError = error as any;
        const fieldErrors: Partial<ForgotPasswordFormData> = {};
        
        zodError.errors?.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ForgotPasswordFormData] = err.message;
          }
        });
        
        setErrors(fieldErrors);
      } else {
        // Handle network or other errors
        console.error("Forgot password error:", error);
        setMessage({ type: "error", text: "Wystąpił błąd podczas wysyłania linku resetującego. Sprawdź połączenie internetowe." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mt-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Email wysłany!
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sprawdź swoją skrzynkę pocztową i kliknij link do resetowania hasła.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ email: "" });
              setMessage(null);
            }}
            variant="outline"
            className="w-full"
          >
            Wyślij ponownie
          </Button>
          
          <div className="text-center">
            <a href="/login" className="text-sm text-primary hover:text-primary/80">
              Powrót do logowania
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Adres email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm ${
              errors.email
                ? "border-red-300 dark:border-red-600"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            placeholder="Wprowadź swój email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            Wprowadź adres email powiązany z Twoim kontem, a wyślemy Ci link do resetowania hasła.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-md p-4 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="space-y-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
        </Button>
        
        <div className="text-center">
          <a href="/login" className="text-sm text-primary hover:text-primary/80">
            Powrót do logowania
          </a>
        </div>
      </div>
    </form>
  );
}

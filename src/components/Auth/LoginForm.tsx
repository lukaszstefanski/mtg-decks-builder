import React, { useState } from "react";
import { Button } from "../ui/button";
import { loginSchema, type LoginFormData } from "../../lib/schemas/auth.schemas";

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
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
      const validatedData = loginSchema.parse(formData);

      // API call to login endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: validatedData.email,
          password: validatedData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (result.error === "VALIDATION_ERROR" && result.errors) {
          // Handle validation errors from server
          const fieldErrors: Partial<LoginFormData> = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field as keyof LoginFormData] = messages[0];
            }
          });
          setErrors(fieldErrors);
        } else {
          // Handle other API errors
          setMessage({ type: "error", text: result.message || "Wystąpił błąd podczas logowania" });
        }
        return;
      }

      // Successful login
      setMessage({ type: "success", text: result.message || "Zalogowano pomyślnie!" });

      // Redirect to home page after successful login
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        // Handle client-side validation errors
        const zodError = error as any;
        const fieldErrors: Partial<LoginFormData> = {};

        zodError.errors?.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        // Handle network or other errors
        console.error("Login error:", error);
        setMessage({ type: "error", text: "Wystąpił błąd podczas logowania. Sprawdź połączenie internetowe." });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              errors.email ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            placeholder="Wprowadź swój email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasło
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm ${
              errors.password ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            placeholder="Wprowadź swoje hasło"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Zapamiętaj mnie
            </label>
          </div>

          <div className="text-sm">
            <a href="/forgot-password" className="font-medium text-primary hover:text-primary/80">
              Zapomniałeś hasła?
            </a>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-md p-4 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
          }`}
          data-testid={message.type === "success" ? "success-message" : "error-message"}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </div>
    </form>
  );
}

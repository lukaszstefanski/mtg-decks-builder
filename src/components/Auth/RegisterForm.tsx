import React, { useState } from "react";
import { Button } from "../ui/button";
import { registerSchema, type RegisterFormData } from "../../lib/schemas/auth.schemas";

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
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
      const validatedData = registerSchema.parse(formData);

      // API call to register endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: validatedData.email,
          password: validatedData.password,
          username: validatedData.username,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (result.error === "VALIDATION_ERROR" && result.errors) {
          // Handle validation errors from server
          const fieldErrors: Partial<RegisterFormData> = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field as keyof RegisterFormData] = messages[0];
            }
          });
          setErrors(fieldErrors);
        } else {
          // Handle other API errors
          setMessage({ type: "error", text: result.message || "Wystąpił błąd podczas rejestracji" });
        }
        return;
      }

      // Successful registration
      setMessage({ type: "success", text: result.message || "Rejestracja udana! Możesz się teraz zalogować." });

      // Redirect to login page after successful registration
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        // Handle client-side validation errors
        const zodError = error as { errors?: { path: string[]; message: string }[] };
        const fieldErrors: Partial<RegisterFormData> = {};

        zodError.errors?.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        // Handle network or other errors
        setMessage({ type: "error", text: "Wystąpił błąd podczas rejestracji. Sprawdź połączenie internetowe." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nazwa użytkownika
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm ${
              errors.username ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            placeholder="Wprowadź nazwę użytkownika"
          />
          {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>}
        </div>

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
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm ${
              errors.password ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            placeholder="Wprowadź hasło (min. 8 znaków)"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            Tworząc konto, zgadzasz się na nasze{" "}
            <button type="button" className="text-primary hover:text-primary/80 underline">
              Warunki Użytkowania
            </button>{" "}
            i{" "}
            <button type="button" className="text-primary hover:text-primary/80 underline">
              Politykę Prywatności
            </button>
            .
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

      <div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Rejestracja..." : "Utwórz konto"}
        </Button>
      </div>
    </form>
  );
}

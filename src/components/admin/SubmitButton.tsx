"use client";

import { useFormStatus } from "react-dom";

/**
 * useFormStatus solo funciona en un componente hijo del <form>, nunca en el
 * mismo componente que declara el <form> -- por eso este botón vive aparte.
 */
export default function SubmitButton({
  children,
  pendingLabel,
  className,
  formAction,
  formNoValidate,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
  formNoValidate?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      formAction={formAction}
      formNoValidate={formNoValidate}
      className={className}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

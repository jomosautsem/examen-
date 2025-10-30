-- Este script SQL crea la tabla `exam_results` necesaria para la aplicación.
-- Define la estructura, tipos de datos y, lo más importante, la clave primaria.
--
-- Cómo usarlo:
-- 1. Ve al panel de tu proyecto en Supabase.
-- 2. En el menú de la izquierda, haz clic en "SQL Editor".
-- 3. Haz clic en "+ New query".
-- 4. Copia y pega todo el contenido de este archivo en el editor.
-- 5. Haz clic en "RUN".
--
-- Esto creará la tabla con la configuración correcta. Si ya tienes una tabla
-- llamada `exam_results`, puede que necesites borrarla primero.

CREATE TABLE public.exam_results (
  user_id uuid NOT NULL,
  name text NOT NULL,
  enrollment_id text NOT NULL,
  score real NOT NULL,
  correct_answers integer NOT NULL,
  incorrect_answers integer NOT NULL,
  answers jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT exam_results_pkey PRIMARY KEY (user_id)
);

-- Habilitar Row Level Security (RLS) en la tabla.
-- Es una buena práctica de seguridad. Por defecto, todo está denegado.
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir el acceso.
-- Ejemplo: Permitir a cualquiera leer todos los resultados (para la página de búsqueda/admin).
-- En una aplicación real, querrías políticas más restrictivas.
CREATE POLICY "Allow public read access" ON public.exam_results
  FOR SELECT USING (true);

-- Ejemplo: Permitir a cualquiera insertar un nuevo resultado.
CREATE POLICY "Allow public insert access" ON public.exam_results
  FOR INSERT WITH CHECK (true);

-- Ejemplo: Permitir a un usuario actualizar su propio registro (no usado actualmente, pero buen ejemplo).
-- CREATE POLICY "Allow individual update access" ON public.exam_results
--   FOR UPDATE USING (auth.uid() = user_id);

-- Ejemplo: Permitir a un usuario borrar su propio registro (no usado actualmente).
-- CREATE POLICY "Allow individual delete access" ON public.exam_results
--   FOR DELETE USING (auth.uid() = user_id);

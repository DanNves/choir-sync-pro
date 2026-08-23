# Choir Sync Pro - Improvements & Bug Fixes

## 1. Auth & Registration Fixes
* **Fix Registration:** Correct the `handle_new_user` trigger in the backend to ensure `nome` is properly extracted from `raw_user_meta_data`.
* **Standard User Redirection:** Adjust routing logic so users without 'dashboard' access (Candidatos, Musicos) are redirected to `/eventos` or a personal view instead of being stuck at a "No permission" screen on the root path.

## 2. Admin View Improvements
* **Self-Profile Visibility:** Ensure the admin user's own profile and data appear correctly in the user list and dashboard.
* **Sensitive Info Handling:** Ensure technically internal keys (IDs) are hidden and user-friendly labels are shown throughout.

## 3. Events Module Enhancements
* **Active/Inactive Status:** Add an `ativo` boolean column to the `events` table (Soft Delete strategy).
* **Role-Based Visibility:**
    * **Admins:** View both active and inactive events.
    * **General Users:** View only active events.
* **Time Model (Horário):** Update the event creation form to include specific start/end times or time models.

## Technical Details

### Database (Supabase)
```sql
-- Add active status to events
ALTER TABLE public.events ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;

-- Update RLS for events to filter by active status for non-admins
DROP POLICY "Todos podem ver eventos" ON public.events;
CREATE POLICY "Admins veem todos eventos" ON public.events FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Usuários veem eventos ativos" ON public.events FOR SELECT USING (active = true);

-- Fix trigger metadata handling if needed (validation)
```

### Frontend Changes
* **ProtectedRoute/Index:** Update `src/pages/Index.tsx` to redirect non-admins to `/eventos` if they don't have dashboard access.
* **EventModal:** Add a toggle for `active` status in `src/pages/Eventos.tsx` and the duration/time selection.
* **useEvents:** Filter results based on status or fetch all if admin.

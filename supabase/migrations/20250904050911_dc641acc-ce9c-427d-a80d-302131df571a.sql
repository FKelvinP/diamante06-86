-- Insert admin user directly into auth.users and profiles
-- First, let's check if admin user already exists and insert if not
DO $$
BEGIN
  -- Check if admin user already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@diamante.com'
  ) THEN
    -- Insert into auth.users (this will trigger profile creation automatically)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      confirmation_token,
      recovery_sent_at,
      recovery_token,
      email_change_sent_at,
      email_change,
      email_change_token_new,
      email_change_token_current,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      phone_change_sent_at,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at,
      is_sso_user,
      deleted_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@diamante.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      '',
      null,
      '',
      null,
      '',
      '',
      '',
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Administrador do Sistema","phone":"(11) 99999-9999"}',
      false,
      null,
      null,
      '',
      '',
      null,
      0,
      null,
      '',
      null,
      false,
      null
    );
  END IF;
END $$;
-- Inserir alguns dados de teste
-- Primeiro vamos criar alguns perfis de teste
INSERT INTO profiles (user_id, full_name, phone, role, is_active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'João Silva', '(11) 99999-1111', 'customer', true),
  ('00000000-0000-0000-0000-000000000002', 'Maria Santos', '(11) 99999-2222', 'customer', true),
  ('00000000-0000-0000-0000-000000000003', 'Pedro Costa', '(11) 99999-3333', 'customer', true);

-- Criar alguns agendamentos de teste
INSERT INTO appointments (customer_id, service_id, appointment_date, appointment_time, total_amount, status, notes) VALUES
  (
    (SELECT id FROM profiles WHERE full_name = 'João Silva'),
    (SELECT id FROM services WHERE name = 'Lavagem Completa'),
    CURRENT_DATE + INTERVAL '1 day',
    '14:00',
    45.00,
    'confirmed',
    'Cliente solicitou cera extra'
  ),
  (
    (SELECT id FROM profiles WHERE full_name = 'Maria Santos'),
    (SELECT id FROM services WHERE name = 'Enceramento'),
    CURRENT_DATE + INTERVAL '2 days',
    '10:00',
    80.00,
    'pending',
    'Primeira vez no estabelecimento'
  ),
  (
    (SELECT id FROM profiles WHERE full_name = 'Pedro Costa'),
    (SELECT id FROM services WHERE name = 'Detalhamento'),
    CURRENT_DATE,
    '16:00',
    150.00,
    'completed',
    'Serviço executado com excelência'
  );
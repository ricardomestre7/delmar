-- Inicialização Soberana de Esquema CylinderMargin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS system_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_telemetry (sector, status, payload)
VALUES ('core', 'initialized', '{"message": "CylinderMargin Data Layer Active"}'::jsonb);

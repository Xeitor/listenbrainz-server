CREATE TYPE background_tasks_type AS ENUM ('delete_listens', 'delete_user');

BEGIN;

CREATE TABLE background_tasks (
    id              INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    user_id         INTEGER NOT NULL,
    task            background_tasks_type NOT NULL,
    created         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE background_tasks ADD CONSTRAINT background_tasks_id_pkey PRIMARY KEY (id);

ALTER TABLE background_tasks
    ADD CONSTRAINT background_tasks_user_id_foreign_key
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE CASCADE;

CREATE INDEX background_tasks_user_id_task_type_idx ON background_tasks (user_id, task);

COMMIT;

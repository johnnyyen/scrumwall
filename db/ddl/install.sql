CREATE CACHED TABLE item(
    id IDENTITY,
    content VARCHAR,
    estimation INT,
    sprint_id INTEGER,
    offset_x INTEGER,
    offset_y INTEGER,
    col INTEGER,
    owner VARCHAR
);
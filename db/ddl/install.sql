DROP TABLE item IF EXISTS ;
CREATE CACHED TABLE item(
    id IDENTITY,
    content VARCHAR(4096),
    estimation INTEGER DEFAULT NULL,
    offsetx DECIMAL DEFAULT 0,
    offsety DECIMAL DEFAULT 0,
    col INTEGER DEFAULT 0,
    owner VARCHAR(25) DEFAULT NULL,
    color VARCHAR(10) NOT NULL,
    height INTEGER NOT NULL,
    width INTEGER NOT NULL
);


DROP TABLE col IF EXISTS ;
CREATE CACHED TABLE col(
    id IDENTITY,
    name VARCHAR(100) NOT NULL,
    columntype VARCHAR(20) DEFAULT NULL,
    columnorder INTEGER NOT NULL,
    width DECIMAL DEFAULT NULL,
    sprintId INTEGER NOT NULL
);

DROP TABLE sprint IF EXISTS;
CREATE CACHED TABLE sprint(
    id IDENTITY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

INSERT INTO sprint(start_date, end_date) 
    VALUES(CURDATE(), '2011-11-11');

INSERT INTO col(name, columntype, columnorder, width, sprintId)
    VALUES('Not Started', 'NOT_STARTED', 0, 33, 0);

INSERT INTO col(name, columntype, columnorder, width, sprintId)
    VALUES('In progress', 'IN_PROGRESS', 1, 34, 0);
    
INSERT INTO col(name, columntype, columnorder, width, sprintId)
    VALUES('DONE', 'DONE', 2, 33, 0);

INSERT INTO col(id, name, columntype, columnorder, sprintId)
    VALUES(-2, 'GOALS', 'GOALS', 0, 0);
    
INSERT INTO col(id, name, columntype, columnorder, sprintId)
    VALUES(-1, 'UCB', 'UCB', 0, 0);
    
INSERT INTO col(id, name, columntype, columnorder, sprintId)
    VALUES(-3, 'IMPEDIMENTS', 'IMPEDIMENTS', 0, 0);
    
ALTER TABLE item 
    ADD CONSTRAINT ItemToColumn FOREIGN KEY (col)
    REFERENCES col(id)
    ON DELETE SET DEFAULT;
    
ALTER TABLE col
    ADD CONSTRAINT COLUMN_TO_SPRINT FOREIGN KEY (sprintId)
    REFERENCES sprint(id);
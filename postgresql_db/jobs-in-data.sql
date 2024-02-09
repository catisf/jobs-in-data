CREATE TABLE "job_category" (
    "cat_id" int   NOT NULL,
    "job_category" varchar(30)   NOT NULL,
    CONSTRAINT "pk_job_category" PRIMARY KEY (
        "cat_id"
     )
);

CREATE TABLE "job_title" (
    "title_id" int   NOT NULL,
    "job_title" varchar(100)   NOT NULL,
    CONSTRAINT "pk_job_title" PRIMARY KEY (
        "title_id"
     )
);

CREATE TABLE "location" (
    "location_id" int   NOT NULL,
    "company_location" varchar(30)   NOT NULL,
    CONSTRAINT "pk_location" PRIMARY KEY (
        "location_id"
     )
);


CREATE TABLE "job" (
    "job_id" varchar(10)   NOT NULL,
    "work_year" int   NOT NULL,
    "employee_residence" varchar(30)   NOT NULL,
    "experience_level" varchar(30)   NOT NULL,
    "employment_type" varchar(30)   NOT NULL,
    "work_setting" varchar(30)   NOT NULL,
    "company_size" varchar(30)   NOT NULL,
    "cat_id" int   NOT NULL,
    "title_id" int   NOT NULL,
    "location_id" int   NOT NULL,
    CONSTRAINT "pk_job" PRIMARY KEY (
        "job_id"
     )
);

CREATE TABLE "salary" (
    "job_id" varchar   NOT NULL,
    "salary_in_usd" int   NOT NULL,
    "salary_in_gbp" int   NOT NULL
);

ALTER TABLE "salary" ADD CONSTRAINT "fk_salary_job_id" FOREIGN KEY("job_id")
REFERENCES "job" ("job_id");

ALTER TABLE "job" ADD CONSTRAINT "fk_job_cat_id" FOREIGN KEY("cat_id")
REFERENCES "job_category" ("cat_id");

ALTER TABLE "job" ADD CONSTRAINT "fk_job_title_id" FOREIGN KEY("title_id")
REFERENCES "job_title" ("title_id");

ALTER TABLE "job" ADD CONSTRAINT "fk_job_location_id" FOREIGN KEY("location_id")
REFERENCES "location" ("location_id");


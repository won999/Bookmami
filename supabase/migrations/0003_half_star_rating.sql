alter table reading_logs
  drop constraint if exists reading_logs_rating_check;

alter table reading_logs
  alter column rating type real using rating::real,
  alter column rating set default 0;

alter table reading_logs
  add constraint reading_logs_rating_check check (rating >= 0 and rating <= 5);

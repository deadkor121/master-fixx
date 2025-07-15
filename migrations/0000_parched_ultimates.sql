CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"master_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"client_name" text NOT NULL,
	"client_phone" text NOT NULL,
	"address" text NOT NULL,
	"scheduled_date" text NOT NULL,
	"scheduled_time" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'pending',
	"estimated_price" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "masters" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"specialization" text NOT NULL,
	"description" text NOT NULL,
	"experience" text NOT NULL,
	"hourly_rate" numeric(10, 2) NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0',
	"review_count" integer DEFAULT 0,
	"is_verified" boolean DEFAULT false,
	"avatar" text,
	"completed_jobs" integer DEFAULT 0,
	"response_time" text DEFAULT '< 30 хв',
	"repeat_clients" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer DEFAULT 0 NOT NULL,
	"text" text NOT NULL,
	"sent_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"master_id" integer NOT NULL,
	"client_id" integer NOT NULL,
	"booking_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"client_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"base_price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"master_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"user_type" text NOT NULL,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"middle_name" text,
	"city" text,
	"birth_date" text,
	"gender" text,
	"about" text,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

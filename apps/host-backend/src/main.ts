import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env["FRONTEND_URL"] ?? "http://localhost:5173",
    credentials: true,
  });

  // Set global prefix for API routes
  app.setGlobalPrefix("api");

  const port = process.env["PORT"] ?? 3000;
  await app.listen(port);

  console.log(`🚀 Configent Host Backend running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});

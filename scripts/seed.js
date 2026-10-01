import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/security";

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@mantenimiento.gov.co" },
    update: {},
    create: {
      email: "admin@mantenimiento.gov.co",
      password: await hashPassword("Admin123*"),
      name: "Administrador",
      role: 1,
    },
  });
  console.log("Usuario admin listo:", admin.email);

  const tecnico = await prisma.user.upsert({
    where: { email: "tecnico@mantenimiento.gov.co" },
    update: {},
    create: {
      email: "tecnico@mantenimiento.gov.co",
      password: await hashPassword("Tecnico123*"),
      name: "Técnico Mantenimiento",
      role: 3,
    },
  });
  console.log("Usuario técnico listo:", tecnico.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
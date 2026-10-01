import prisma from "@/lib/prisma";

export async function getUserByEmail(email) {
  if (!email) return null;
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("Error al obtener usuario por email:", error);
    return null;
  }
}

export async function createUser({ email, password, name, role = 3 }) {
  try {
    return await prisma.user.create({
      data: { email, password, name, role },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return null;
  }
}
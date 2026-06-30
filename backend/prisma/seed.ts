import { PrismaClient, Role, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = '$2a$12$LJ3m4ys3Lk0TSwHnbfOMi.vG0mKREBSZw9Yd9NxR3v5XQz9Yx8b7e';

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hopitaldigital.com' },
    update: {},
    create: {
      email: 'admin@hopitaldigital.com',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  const hospitalUser = await prisma.user.upsert({
    where: { email: 'hospital@hopitaldigital.com' },
    update: {},
    create: {
      email: 'hospital@hopitaldigital.com',
      password: hashedPassword,
      role: Role.HOSPITAL_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  const hospital = await prisma.hospital.upsert({
    where: { slug: 'hopital-principal' },
    update: {},
    create: {
      name: 'Hôpital Principal',
      slug: 'hopital-principal',
      description: 'Hôpital généraliste de référence',
      address: '1 Rue de la Santé',
      city: 'Paris',
      country: 'FR',
      postalCode: '75001',
      phone: '+33123456789',
      email: 'contact@hopitalprincipal.fr',
      status: UserStatus.ACTIVE,
      isVerified: true,
      ownerId: hospitalUser.id,
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@hopitaldigital.com' },
    update: {},
    create: {
      email: 'doctor@hopitaldigital.com',
      password: hashedPassword,
      role: Role.DOCTOR,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  await prisma.doctorProfile.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      firstName: 'Thomas',
      lastName: 'Bernard',
      specialty: 'Cardiologie',
      licenseNumber: '12345ABC',
      yearsOfExperience: 15,
      biography: 'Spécialiste en cardiologie interventionnelle',
      consultationFee: 80.0,
      hospitalId: hospital.id,
      isAvailable: true,
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@hopitaldigital.com' },
    update: {},
    create: {
      email: 'patient@hopitaldigital.com',
      password: hashedPassword,
      role: Role.PATIENT,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  await prisma.patientProfile.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      firstName: 'Sophie',
      lastName: 'Martin',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'FEMALE',
      bloodGroup: 'A_POSITIVE',
      address: '15 Rue des Lilas',
      city: 'Paris',
      country: 'FR',
      emergencyPhone: '+33612345678',
    },
  });

  await prisma.department.upsert({
    where: { hospitalId_name: { hospitalId: hospital.id, name: 'Cardiologie' } },
    update: {},
    create: { hospitalId: hospital.id, name: 'Cardiologie', description: 'Services cardiologiques' },
  });

  await prisma.department.upsert({
    where: { hospitalId_name: { hospitalId: hospital.id, name: 'Urgences' } },
    update: {},
    create: { hospitalId: hospital.id, name: 'Urgences', description: "Service d'urgences" },
  });

  console.log('Seed completed successfully!');
  console.log('---');
  console.log('Admin: admin@hopitaldigital.com / Password123!');
  console.log('Hospital: hospital@hopitaldigital.com / Password123!');
  console.log('Doctor: doctor@hopitaldigital.com / Password123!');
  console.log('Patient: patient@hopitaldigital.com / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

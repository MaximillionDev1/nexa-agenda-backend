import { prisma } from '../src/config/database.js';
import bcrypt from 'bcrypt';
import { addDays, addHours } from 'date-fns';

const DEFAULT_SERVICES = [
  {
    name: 'Corte Masculino',
    description: 'Corte clássico para cavalheiros',
    duration: 45,
    price: '45.00',
    icon: 'Scissors',
  },
  {
    name: 'Barba',
    description: 'Aparagem e modelagem de barba',
    duration: 30,
    price: '30.00',
    icon: 'Zap',
  },
  {
    name: 'Corte e Barba',
    description: 'Serviço completo de corte e barba',
    duration: 60,
    price: '65.00',
    icon: 'Sparkles',
  },
  {
    name: 'Tratamento Capilar',
    description: 'Tratamento profissional para o cabelo',
    duration: 45,
    price: '55.00',
    icon: 'Droplets',
  },
  {
    name: 'Acabamento',
    description: 'Finalização e ajustes de detalhes',
    duration: 20,
    price: '20.00',
    icon: 'Check',
  },
];

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // ============================================
    // 1. CRIAR ADMIN
    // ============================================
    console.log('📝 Criando admin...');

    const passwordHash = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.admin.upsert({
      where: { email: 'admin@nexaagenda.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@nexaagenda.com',
        passwordHash,
      },
    });

    console.log('✅ Admin criado:', admin.email);

    // ============================================
    // 2. CRIAR SERVIÇOS
    // ============================================
    console.log('📝 Criando serviços...');

    for (const service of DEFAULT_SERVICES) {
      await prisma.service.upsert({
        where: { id: service.name },
        update: {},
        create: {
          id: service.name,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: parseFloat(service.price),
          icon: service.icon,
          isActive: true,
        },
      });
    }

    console.log('✅ Serviços criados');

    // ============================================
    // 3. CRIAR HORÁRIOS DE FUNCIONAMENTO
    // ============================================
    console.log('📝 Criando horários de funcionamento...');

    const businessHours = [
      { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isOpen: false }, // Domingo
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isOpen: true },  // Segunda
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isOpen: true },  // Terça
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isOpen: true },  // Quarta
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isOpen: true },  // Quinta
      { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isOpen: true },  // Sexta
      { dayOfWeek: 6, startTime: '09:00', endTime: '16:00', isOpen: true },  // Sábado
    ];

    for (const hours of businessHours) {
      await prisma.businessHours.upsert({
        where: { dayOfWeek: hours.dayOfWeek },
        update: {},
        create: hours,
      });
    }

    console.log('✅ Horários de funcionamento criados');

    // ============================================
    // 4. CRIAR AGENDAMENTOS DE EXEMPLO
    // ============================================
    console.log('📝 Criando agendamentos de exemplo...');

    const services = await prisma.service.findMany();
    const corte = services.find((s) => s.name === 'Corte Masculino');

    if (corte) {
      // Agendamento hoje
      const today = new Date();
      today.setHours(14, 0, 0, 0);
      const endToday = addHours(today, 1);

      await prisma.appointment.create({
        data: {
          publicCode: 'NX-ABC123',
          customerName: 'João Silva',
          customerPhone: '11999999999',
          serviceId: corte.id,
          appointmentDate: today,
          startTime: today,
          endTime: endToday,
          notes: 'Cliente regular',
          status: 'CONFIRMED',
        },
      });

      // Agendamento amanhã
      const tomorrow = addDays(today, 1);
      tomorrow.setHours(10, 0, 0, 0);
      const endTomorrow = addHours(tomorrow, 1);

      await prisma.appointment.create({
        data: {
          publicCode: 'NX-XYZ789',
          customerName: 'Maria Santos',
          customerPhone: '11988888888',
          serviceId: corte.id,
          appointmentDate: tomorrow,
          startTime: tomorrow,
          endTime: endTomorrow,
          notes: 'Primeira vez',
          status: 'SCHEDULED',
        },
      });
    }

    console.log('✅ Agendamentos de exemplo criados');

    console.log('\n🎉 Seed executado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
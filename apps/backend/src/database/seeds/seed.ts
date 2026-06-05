import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Skill, Subject, User, UserRole } from '../entities';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Subject, Skill],
  synchronize: false,
});

const subjects = [
  { nama: 'SNBT_TPS', jenis: 'SNBT' },
  { nama: 'SNBT_LIT_IND', jenis: 'SNBT' },
  { nama: 'SNBT_LIT_ING', jenis: 'SNBT' },
  { nama: 'SNBT_PM', jenis: 'SNBT' },
  { nama: 'SKD_TWK', jenis: 'SKD' },
  { nama: 'SKD_TIU', jenis: 'SKD' },
  { nama: 'SKD_TKP', jenis: 'SKD' },
];

const skillMap: Record<string, string[]> = {
  SNBT_TPS: ['Penalaran Umum - Silogisme', 'Penalaran Umum - Analogi', 'Penalaran Umum - Deret Angka'],
  SNBT_LIT_IND: ['Literasi Indonesia - Ide Pokok', 'Literasi Indonesia - Simpulan', 'Literasi Indonesia - Makna Kata'],
  SNBT_LIT_ING: ['English Literacy - Main Idea', 'English Literacy - Inference', 'English Literacy - Vocabulary'],
  SNBT_PM: ['Penalaran Matematika - Aljabar', 'Penalaran Matematika - Geometri', 'Penalaran Matematika - Statistika'],
  SKD_TWK: ['TWK - Pancasila', 'TWK - UUD 1945', 'TWK - Sejarah Nasional'],
  SKD_TIU: ['TIU - Numerik', 'TIU - Verbal', 'TIU - Figural'],
  SKD_TKP: ['TKP - Integritas', 'TKP - Pelayanan Publik', 'TKP - Jejaring Kerja'],
};

async function runSeed(): Promise<void> {
  await dataSource.initialize();

  const subjectRepo = dataSource.getRepository(Subject);
  const skillRepo = dataSource.getRepository(Skill);
  const userRepo = dataSource.getRepository(User);

  const createdSubjects = new Map<string, Subject>();

  for (const subject of subjects) {
    let existing = await subjectRepo.findOne({ where: { nama: subject.nama } });
    if (!existing) {
      existing = await subjectRepo.save(subjectRepo.create(subject));
    }
    createdSubjects.set(subject.nama, existing);
  }

  for (const [subjectCode, skills] of Object.entries(skillMap)) {
    const subject = createdSubjects.get(subjectCode);
    if (!subject) {
      continue;
    }
    for (const nama of skills) {
      const existing = await skillRepo.findOne({ where: { subjectId: subject.id, nama } });
      if (!existing) {
        await skillRepo.save(skillRepo.create({ subjectId: subject.id, nama }));
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    const users = [
      { email: 'admin@edupath.id', password: 'Admin123!', nama: 'Admin EduPath', role: UserRole.ADMIN },
      { email: 'tentor@edupath.id', password: 'Tentor123!', nama: 'Tentor EduPath', role: UserRole.TENTOR },
      { email: 'siswa@edupath.id', password: 'Siswa123!', nama: 'Siswa EduPath', role: UserRole.STUDENT },
      { email: 'ortu@edupath.id', password: 'Ortu123!', nama: 'Orang Tua EduPath', role: UserRole.PARENT },
    ];

    const createdUsers = new Map<string, User>();

    for (const item of users) {
      let existing = await userRepo.findOne({ where: { email: item.email } });
      if (!existing) {
        existing = await userRepo.save(
          userRepo.create({
            email: item.email,
            nama: item.nama,
            role: item.role,
            passwordHash: await bcrypt.hash(item.password, 12),
            targetJalur: item.role === UserRole.STUDENT ? 'KEDUANYA' : null,
            parentId: null,
          }),
        );
      }
      createdUsers.set(item.email, existing);
    }

    const siswa = createdUsers.get('siswa@edupath.id');
    const ortu = createdUsers.get('ortu@edupath.id');
    if (siswa && ortu && siswa.parentId !== ortu.id) {
      siswa.parentId = ortu.id;
      await userRepo.save(siswa);
    }
  }

  await dataSource.destroy();
}

void runSeed();

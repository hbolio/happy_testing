import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DishesClientList from './DishesClientList';
import { PrismaClient } from '@prisma/client';

export default async function DishesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session || !session.value) {
    redirect('/login');
  }

  const prisma = new PrismaClient();
  const dishes = await prisma.dish.findMany({
    where: { userId: Number(session.value) },
  });

  return (
    <div className="py-10 px-2 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Sugerencias de Platillos</h1>
        <Link href="/dishes/new" className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-300" title="Agregar un nuevo platillo">+ Agregar Platillo</Link>
      </div>
      {dishes.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-lg text-gray-500">No hay platillos registrados.</span>
        </div>
      ) : (
        <DishesClientList dishes={dishes} />
      )}
    </div>
  );
}

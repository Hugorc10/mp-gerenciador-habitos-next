import DayState from '@/components/DayState'
import { kv } from '@vercel/kv';
import Image from 'next/image'
import Link from 'next/link';

export default async function Home() {
  const habits = await kv.hgetall('habits')

  const today = new Date();
  const todayWeekDay = today.getDay();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const sortedWeekDays = weekDays
      .slice(todayWeekDay + 1)
      .concat(weekDays.slice(0, todayWeekDay + 1));

  const last7Days = weekDays.map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);

    return date.toISOString().slice(0, 10);
  });

  console.log(last7Days);

  return (
    <main className='container relative flex flex-col gap-8 px-4 pt-16 text-center'>
      {habits === null || Object.keys(habits).length === 0 && (
        <h1 className='mt-20 text-4xl font-light text-white font-display'>
          Você não tem hábitos cadastrados
        </h1>
      )}
      {habits !== null && Object.entries(habits).map(([habit, habitStreak]) => (
            <div key={habit} className='flex flex-col gap-2'>
              <section className='flex justify-between items-center'>
                <span className='text-xl font-light text-white font-sans'>{habit}</span>
                <button>
                  <Image src='/images/trash.svg' width={20} height={20} alt='Remover hábito' />
                </button>
              </section>
              <section className='grid grid-cols-7 bg-neutral-800 rounded-md p-2'>
                {sortedWeekDays.map((day) => (
                  <div key={day} className='flex flex-col text-center last:font-bold'>
                    <span  className='text-white font-sans text-xs'>{day}</span>
                    {/* day state */}
                    <DayState day={habitStreak} />
                  </div>
                ))}
              </section>
            </div>
      ))}

      <Link href='novo-habito' className='fixed text-center bottom-10 w-2/3 left-1/2
      -translate-x-1/2 text-neutral-900 bg-[#45EDAD] font-display font-regular text-2xl
        p-2'>novo hábito</Link>

    </main>
  )
}

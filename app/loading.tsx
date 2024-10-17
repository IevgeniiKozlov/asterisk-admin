'use client'

const Loading = () => {
  return (
    <section className='h-[calc(100vh-80px)]'>
      <div className='w-full h-full flex items-center justify-center pb-5'>
        <div className='flex gap-3'>
          <h2 className='text-6xl font-manrope font-extrabold text-transparent bg-gradient-to-tr from-orange-200 to-orange-400 bg-clip-text flex items-center'>
            L{' '}
            <span className='text-transparent bg-gradient-to-tr from-orange-200 to-orange-400 bg-clip-text animate-spin'>
              0
            </span>
            ading...
          </h2>
        </div>
      </div>
    </section>
  )
}

export default Loading

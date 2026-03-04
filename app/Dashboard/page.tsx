import Chat from '@/components/Chat'
import PdfUploader from '@/components/PdfUploader'


const Page = () => {
  return (
    <div className='bg-zinc-900 text-white h-screen overflow-hidden min-w-screen flex justify-center items-center flex-col sm:flex-row gap-4 '>
      <div className="pdfuploadsection sm:w-1/3 w-full ">
        <PdfUploader/>
      </div>
      <div className="chatsection sm:w-2/3 w-full h-screen overflow-y-scroll border-l-2 bg-zinc-800 border-zinc-600">
          <Chat/>
      </div>
    </div>
  )
}

export default Page

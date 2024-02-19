function VideoPlayer({ title, url, className }: { title: string, url: string, className?: string}) {
  return (
    <div className="mx-2 md:mx-14 lg:mx-32 aspect-video rounded-3xl overflow-hidden flex w-full  max-w-3xl">
      <iframe
        className="aspect-video"
        width="100%"
        height="100%"
        src={url}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>  )
}

export default VideoPlayer

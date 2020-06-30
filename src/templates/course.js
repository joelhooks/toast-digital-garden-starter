/** @jsx h */
import {h} from 'preact'

export default (series) => {
  return (
    <main>
      <h1 className="text-center text-4xl md:text-left md:text-6xl">
        {series.title}
      </h1>
      <div>
        <img src={series.square_cover_url} />
      </div>
    </main>
  )
}

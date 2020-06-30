/** @jsx h */
import {h} from 'preact'

export default ({courses}) => {
  return (
    <main>
      <h1 className="text-center text-4xl md:text-left md:text-6xl">
        All Courses
      </h1>
      <ul>
        {courses.map((course) => {
          return (
            <article className="py-2 px-3 transition-all duration-200 ease-in-out hover:text-green-700 hover:bg-green-100 mb-2">
              <a
                className="flex items-center text-md md:text-2xl rounded-sm mb-3 hover:no-underline"
                href={`/${course.slug}`}
              >
                <img src={course.image} />
                {course.title}
              </a>
              <p className="text-sm md:text-base mb-0">{course.description}</p>
            </article>
          )
        })}
      </ul>
    </main>
  )
}

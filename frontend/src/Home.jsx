import { Link, useParams } from "react-router-dom"
import { useGetCarsQuery } from "./redux/api/carApiSlice"
import Loader from "./components/Loader"
import Header from "./components/Header"
import Message from "./components/Message"

const Home = () => {
    const {keyword} = useParams()
    const {data, isLoading, isError} = useGetCarsQuery({keyword})

    return (
        <>
            {!keyword ? <Header /> : null}
            {isLoading ? (<Loader />) : isError ? (<Message variant='danger'>
                {isError?.data?.message || isError.error}
            </Message>) : (
                <></>
            )}
        </>
    )
}

export default Home
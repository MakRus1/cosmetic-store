import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallCar = ({car}) => {
    return (
        <div className="w-[20rem] ml-[2rem] p-3 bg-[#f9fde9] text-black border mb-6 rounded-lg border border-[#799400]">
            <div className="relative">
                <div className="p-54">
                    <HeartIcon car={car} />
                    <img src={car.PRODUCT_IMAGE} alt={car.NAME} className="h-auto rounded" />
                    <Link to={`/car/${car.ID}`}>
                        <h2 className="flex justify-between items-center">
                            <div>{car.NAME}</div>
                            <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                {car.PRICE} ₽
                            </span>  
                        </h2>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SmallCar
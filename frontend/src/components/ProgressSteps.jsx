const ProgressSteps = ({step1, step2, step3}) => {
    return (
        <div className="flex justify-center items-center space-x-4">
            <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
                <span className="ml-2">Продукты</span>
                <div className="mt-2 text-lg text-center">✅</div>
            </div>

            {step2 && (
                <>
                    {step1 && <div className="h-0.5 w-[10rem] bg-green-500"></div>}
                    <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
                        <span className="ml-2">Доставка</span>
                        <div className="mt-2 text-lg text-center">✅</div>   
                    </div>
                </>
            )}

            <>
                {step1 && step2 && step3 ? (
                    <>
                        <div className="h-0.5 w-[10rem] bg-green-500"></div>
                    </>
                ) : (
                    ""
                )} 

                <div className={`${step3 ? "text-green-500" : "text-black"}`}>
                    <span className={`${!step3 ? 'ml-[10rem]' : ''}`}>Итого</span>
                    {step1 && step2 && step3 ? (
                        <div className="mt-2 text-lg text-center">✅</div>
                    ) : (
                        ""
                    )}
                </div>   
            </>
        </div>
    )
}

export default ProgressSteps
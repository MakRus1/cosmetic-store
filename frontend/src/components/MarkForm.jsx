const MarkForm = ({value, setValue, handleSubmit, buttonText = 'Создать', handleDelete}) => {
    return <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
            <input 
                type="text" 
                className="bg-black text-white py-3 px-4 border rounded-lg w-full" 
                placeholder="Введите название марки"
                value={value}
                onChange={e => setValue(e.target.value)} 
            />

            <div className="flex justify-between">
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus-ring-opacity-50">
                    {buttonText}
                </button>

                

                {handleDelete && (
                    <button
                        onClick={handleDelete} 
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus-ring-opacity-50"
                    >
                        Удалить
                    </button>    
                )}
            </div>
        </form>
    </div>
}

export default MarkForm
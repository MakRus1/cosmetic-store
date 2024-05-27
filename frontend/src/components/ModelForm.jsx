import { useFetchMarksQuery } from "../redux/api/markApiSlice"

const ModelForm = ({name, mark, setName, setMark, handleSubmit, buttonText = 'Создать', handleDelete}) => {
    const {data: marks} = useFetchMarksQuery()

    return <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
            <select 
                type="text" 
                className="bg-black text-white py-3 px-4 border rounded-lg w-full"
                value={mark}
                onChange={e => setMark(e.target.value)} 
            >
                {marks?.map((m) => (
                    <option key={m.ID} value={m.ID}>
                        {m.NAME}
                    </option>
                ))}
            </select>
            <input 
                type="text" 
                className="bg-black text-white py-3 px-4 border rounded-lg w-full" 
                placeholder="Введите название модели"
                value={name}
                onChange={e => setName(e.target.value)} 
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

export default ModelForm
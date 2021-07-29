import React, {useRef, useState} from 'react';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  const searchRef = useRef(null);

  const upload = async (event) => {
  
    let files = Array.from(event.target.files).map(file => {

        let reader = new FileReader();

        return new Promise(resolve => {

            reader.fileName = file.name 
            reader.onload = () => {
              resolve({file: reader.fileName, data:JSON.parse(reader.result)});
            }

            reader.readAsText(file);

        });

    });

    let res = await Promise.all(files);

    setFiles(res);

    console.log(res);
  }

  const findKeyValue = (key) => {
    files.map(({file, data}) => {
      if (data[key]) {
        console.log(file, key, data[key])
      }
      return {}
    })
  }

  const onSearch = (e) => {
    e.preventDefault();
    if (searchRef.current) {
      setSearchKey(searchRef.current.value);
      
      findKeyValue(searchRef.current.value);
    }
  }

  const onSave = (name, data) => {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain;charset=utf-8" });
    saveAs(blob, name);
  }

  const updateKey = () => {
    const inputs = document.querySelectorAll('.new-value');
    const newFiles = [...files];

    for (const input of inputs) {
      if (input.value) {
        const newFileId = newFiles.findIndex(({file}) => file === input.name);
        const newFile = newFiles.find(({file}) => file === input.name);
        const newData = {...newFile.data};
        newData[searchKey] = input.value;
        
        newFile.data = newData;
  
        newFiles[newFileId] = newFile;
      }
    }

    setFiles(newFiles);
  }

  return (
    <>
      <h1>Upload Json file</h1>

      <input type="file" onChange={upload} multiple/>
      <br />
      <br />
      <div>
        {files.map(({file, data}, id) => <p key={'a'+file+id}>
          {file} - <button onClick={() => onSave(file, data)}>save</button>
          </p>)}
      </div>
      <br />
      <br />
      <form onSubmit={onSearch}>
        <label>Key</label>
        <input ref={searchRef} type="text" />
      </form>

      { searchKey && (
        <>
          {files.map(({file, data}, id) => (<p key={'b'+file+id}>
            <span>{file}: </span>
            <strong>{data[searchKey]}</strong>
            <input type="text" name={file} className='new-value'/>
          </p>))}
        </>
      )}

      <button onClick={updateKey}>Update key</button>

    </>
  );
}

export default App;

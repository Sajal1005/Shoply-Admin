import multiparty from 'multiparty';

export default async function handle(req,res){
    const form = new multiparty.Form();
  const {fields,files} = await new Promise((resolve,reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({fields,files});
    });
  });
  for(const file of files.file){
    const ext = file.originalFilename.split('.').pop();
    console.log(ext);
  }
  return res.json('ok');
  
}



// Not parse our req, parse ourselves
export const config = {
    api: {bodyParser: false},
}
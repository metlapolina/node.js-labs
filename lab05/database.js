var util = require('util');
var ee = require('events');

var db_data =[
    {id:1, name: 'Иванов И.И.', bday:'2000-01-01'},
    {id:2, name: 'Петров П.П.', bday:'2000-01-02'},
    {id:3, name: 'Сидоров С.С.', bday:'2000-01-03'},
    {id:4, name: 'Павлов П.И.', bday:'2000-01-04'},
    {id:5, name: 'Семенов С.М.', bday:'2000-01-05'}
];

var count = 0;
var comm = 0;

function DB(){
    this.select = ()=>{count++; return db_data;};
    this.insert = (r)=>{count++; db_data.push(r);};
    this.update = (r)=>{
        count++;
        var index = db_data.findIndex(function(item, i){
            return item.id == r.id;
        });
        if(index!=-1){
            db_data[index].name = r.name;
            db_data[index].dbay = r.dbay;
            return db_data[index];
        }
        else
            return 'not found';
    }
    this.delete = (id)=>{
        count++;
        var index = db_data.findIndex(function(item, i){
            return item.id === id;
        });
        if(index!=-1)
            return db_data.splice(index, 1);
        else
            return 'not found';
    }
    this.commit = ()=>{
        comm++;
        console.log('commit');
    }
    this.getStatistics = (date)=>{
        var stat =[
            {start:date, finish:(new Date()).toJSON(), request:count, commit:comm}
        ];
        return stat;
    }
}

util.inherits(DB, ee.EventEmitter);

exports.DB = DB;
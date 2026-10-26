export const stayStyles=[
  {id:"quiet",name:"庭と、読書の旅。",english:"A QUIETER STAY",image:"room",description:"予定を空けて、好きな本を一冊。庭の光を眺めながら、急がない一日を。",afternoon:"窓辺で、本をひらく。",evening:"街へ出て、夕食を楽しむ。"},
  {id:"table",name:"季節を、味わう旅。",english:"A SEASONAL TABLE",image:"meal",description:"荷物をほどいたら、あとは宿で。夕食も、翌朝も、季節のひと膳をゆっくり。",afternoon:"庭を眺め、お茶をひと口。",evening:"宿の食卓で、季節の夕食を。"},
] as const;
export function stayEstimate(style:number,nights:number){
  if(![0,1].includes(style)||![1,2].includes(nights))throw new RangeError("Invalid demo stay");
  const perPerson=style===0?18700:26400;
  return {perPerson,nights,guests:2,total:perPerson*2*nights};
}

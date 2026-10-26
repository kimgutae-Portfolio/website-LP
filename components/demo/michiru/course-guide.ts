export const guideAges=[{id:"first",label:"年長〜小学2年生"},{id:"explore",label:"小学3〜6年生"},{id:"next",label:"中学生"}] as const;
export const guideExperiences=["英語は、はじめて","少しふれたことがある"] as const;
export const guideGoals=["楽しさを見つけたい","会話を楽しみたい","学習にもつなげたい"] as const;
export function recommendCourse(age:string,experience:number,goal:number){
  if(!guideAges.some(item=>item.id===age)||![0,1].includes(experience)||![0,1,2].includes(goal))throw new RangeError("Invalid course guide choice");
  const opening=experience===0?"初めてなら、音と身近なひとことから。":"これまでの経験を聞きながら、今のペースに合わせて。";
  const direction=["好きなものや小さな発見を、英語を楽しむ入口に。","短いやりとりを重ねて、「伝わった」を楽しむ時間に。","使うことと理解することをつなげ、わからないことも質問できる時間に。"][goal];
  return {id:age,reason:opening+direction};
}

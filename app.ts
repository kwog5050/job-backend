import express, { Request, Response } from 'express';
import cors from 'cors';

import { saramin } from './crawling/saramin';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(4545, () => console.log('SERVER ON'));

app.post('/saramin', async (req: Request, res: Response) => {
    const data = await saramin(req.body.keyword);
    res.json(data);
});

/*
www.saramin.co.kr/zf_user/search/recruit
?search_area=main
&search_done=y
&search_optional_item=n
&searchType=search
&searchword=%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C
&recruitPage=2
&recruitSort=relation
&recruitPageCount=40
&inner_com_type=
&company_cd=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10
&show_applied=
&quick_apply=
&except_read=
&ai_head_hunting=
*/

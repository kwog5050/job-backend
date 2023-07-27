import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';

import { saramin } from './crawling/saramin';
import { jobkorea } from './crawling/jobkorea';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(4545, () => console.log('SERVER ON'));

app.post('/saramin', async (req: Request, res: Response) => {
    const data = await saramin(req.body.keyword);
    res.json(data);
});

app.post('/jobkorea', async (req: Request, res: Response) => {
    const data = await jobkorea(req.body.keyword);
    res.json(data);
});

app.post('/all', async (req: Request, res: Response) => {
    const jobkoreaData = await jobkorea(req.body.keyword);
    const saraminData = await saramin(req.body.keyword);
    const data = [...jobkoreaData, ...saraminData];
    data.sort((a: any, b: any) => {
        const dataA: any = a.day === '상시채용' ? new Date('1000-01-01') : new Date(a.day);
        const dataB: any = b.day === '상시채용' ? new Date('1000-01-01') : new Date(b.day);
        console.log('2');

        return dataB - dataA;
    });
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

/*
https://www.jobkorea.co.kr/Search/
?stext=%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C
&tabType=recruit
&Page_No=2
 */

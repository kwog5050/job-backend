import express, { Request, Response } from 'express';
import cors from 'cors';

import { saramin } from './crawling/saramin';
import { jobkorea } from './crawling/jobkorea';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(4545, () => console.log('SERVER ON'));

app.get('/saramin', async (req: Request, res: Response) => {
    const data = await saramin(req.query.keyword, req.query.page);
    res.json(data);
});

app.get('/jobkorea', async (req: Request, res: Response) => {
    const data = await jobkorea(req.query.keyword, req.query.page);
    res.json(data);
});

app.get('/all', async (req: Request, res: Response) => {
    const saraminData = await saramin(req.query.keyword, req.query.page);
    const jobkoreaData = await jobkorea(req.query.keyword, req.query.page);
    const data = {
        pagination: saraminData.pagination.length > jobkoreaData.pagination.length ? saraminData.pagination : jobkoreaData.pagination,
        searchList: [...saraminData.searchList, ...jobkoreaData.searchList],
    };
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

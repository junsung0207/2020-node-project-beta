const MovieModel = require("../../models/movie");
const mongoose = require("mongoose");

const checkId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  next();
};

// 목록조회 (localhost:3000/api/music?limit=2)
// - 성공 : limit 수만큼 music 객체를 담은 배열을 리턴 (200: OK)
// - 실패 : limit가 숫자가 아닌 경우 (400: Bad Request)
const list = (req, res) => {
  const limit = parseInt(req.query.limit || 10);

  if (Number.isNaN(limit)) {
    return res.status(400).end("숫자가 아님");
  }
  MovieModel.find((err, result) => {
    if (err) return res.status(500).end();
    //res.json(result);
    res.render("movie/list", { result });
  })
    .limit(limit)
    .sort({ _id: -1 });
};

// 상세조회 (localhost:3000/api/music/:id)
// - 성공 : id에 해당하는 music 객체 리턴 (200 : OK)
// - 실패 : id 유효하지 않은 경우 (400 : Bad Request)
//          해당하는 id가 없는 경우 (404 : Not Found)
const detail = (req, res) => {
  const id = req.params.id;

  // id로 조회
  MovieModel.findById(id, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.stauts(404).end();
    //res.json(result);
    res.render("movie/detail", { result });
  });
};

// 등록(localhost:3000/api/music)
// 성공 : 등록한 music 객체를 리턴 (201: Created)
// 실패 : singer, title 값 누락 시 400 반환 (400: Bad Request)
const create = (req, res) => {
  const { title, director, year } = req.body;
  if (!title || !director || !year) return res.status(400).end();

  // 2. Model. create()
  MovieModel.create({ title, director, year }, (err, result) => {
    if (err) return res.status(500).end();
    res.status(201).json(result);
  });
};

// 수정 (/music/:id)
// 성공 : id에 해당하는 music 객체에 입력 데이터로 변경
//        해당 객체를 반환 (200:OK)
// 실패 : 유효한 id가 아닐 경우 (400: Bad Request)
//        해당하는 id가 없는 경우 (404: Not Found)
const update = (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  const { title, director, year } = req.body;

  MovieModel.findByIdAndUpdate(
    id,
    { title, director, year },
    { new: true },
    (err, result) => {
      if (err) return res.status(500).end(); //throw error!!
      if (!result) return res.status(404).end();
      res.json(result);
    }
  );
};

// 삭제 (localhost:3000/api/music/:id)
// 성공 : id에 해당하는 객체를 배열에서 삭제 후 결과 배열 리턴(200: OK)
// 실패 : id가 숫자가 아닌 경우(400: Bad Request)
//        해당하는 id가 없는 경우 (404: Not Found)
const remove = (req, res) => {
  const id = req.params.id;

  // 삭제 처리
  MovieModel.findByIdAndDelete(id, (err, result) => {
    if (err) return res.status(500).end(); //throw error!!
    if (!result) return res.status(404).end();
    res.json(result);
  });
};

const showCreatePage = (req, res) => {
  res.render("movie/create");
};

const showUpdatePage = (req, res) => {
  const id = req.params.id;
  MovieModel.findById(id, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.stauts(404).end();
    res.render("movie/update", { result });
  });
};

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
  checkId,
  showCreatePage,
  showUpdatePage,
};
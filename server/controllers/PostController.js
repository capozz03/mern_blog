import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const sortType = req.query.sort;
    const sort = {};

    if (req.query.sort) {
      sort[sortType] = sortType === 'createdAt' ? 1 : -1;
    }

    const posts = await PostModel.find().sort(sort).populate('user').exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map(obj => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getSearchTag = async (req, res) => {
  try {
    const tag = req.params.tag; // из query запроса
    
    const posts = await PostModel.find({ tags: tag }).populate('user').exec();

    res.json(posts);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; // из query запроса

    PostModel.findOneAndUpdate({
        _id: postId, // что найти
      }, {
        $inc: {
          viewsCount: 1, // что изменить
        }
      }, {
        returnDocument: 'after' // после обновления вернуть актуальный документ
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          })
        }

        res.json(doc);
      },
    ).populate('user');

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    }, (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: 'Не удалось удалить статью',
        });
      };

      if (!doc) {
        res.status(404).json({
          message: 'Статья не найдена',
        });
      };

      res.json({
        success: true,
      })
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne({
      _id: postId,
    }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    },
  );

  res.json({
    success: true,
  })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
}
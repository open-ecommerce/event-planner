<?php

namespace common\models;

use Yii;
use \common\models\base\Bookmark as BaseBookmark;
use yii\helpers\ArrayHelper;
use common\models\Book;
use common\models\Article;

/**
 * This is the model class for table "user_bookmark".
 */
class Bookmark extends BaseBookmark {

    const TYPE_BOOK = 1;
    const TYPE_NEWS = 2;


    public function behaviors() {
        return ArrayHelper::merge(
                        parent::behaviors(), [
                        # custom behaviors
                        ]
        );
    }

    public function rules() {
        return ArrayHelper::merge(
                        parent::rules(), [
                        # custom validation rules
                        ]
        );
    }


    public static $bookmarkTypes = array(
        self::TYPE_BOOK => 'Book',
        self::TYPE_NEWS => 'Shouts and Murmurs',
    );

}

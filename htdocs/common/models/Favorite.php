<?php

namespace common\models;

use Yii;
use \common\models\base\Favorite as BaseFavorite;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "user_favorite".
 */
class Favorite extends BaseFavorite
{

public function behaviors()
    {
        return ArrayHelper::merge(
            parent::behaviors(),
            [
                # custom behaviors
            ]
        );
    }

    public function rules()
    {
        return ArrayHelper::merge(
             parent::rules(),
             [
             ]
        );
    }
}

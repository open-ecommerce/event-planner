<?php

namespace common\models;

use Yii;
use \common\models\base\Language as BaseLanguage;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "language".
 */
class Language extends BaseLanguage
{

public function behaviors()
    {
        return ArrayHelper::merge(
            parent::behaviors(),
            [
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
    
    /**
     * @param string $name
     * @return Tag[]
     */
    public static function findAllByName($name)
    {
        return Language::find()
            ->where(['like', 'name', $name])->limit(50)->all();
    }    
    
    
}

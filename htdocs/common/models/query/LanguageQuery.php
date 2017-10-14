<?php

namespace common\models\query;

/**
 * This is the ActiveQuery class for [[Language]].
 *
 * @see Language
 */
class LanguageQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return Language[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Language|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}

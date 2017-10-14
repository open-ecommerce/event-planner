<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205415_user_language_interest_assn extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%user_language_interest_assn}}',
            [
                'user_id'=> $this->integer(11)->null()->defaultValue(null),
                'language_id'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%user_language_interest_assn}}');
    }
}
